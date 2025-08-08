// Supabase Edge Function: search-and-join
// Finds or creates an activity group and joins the current user, then returns the group id
// This function REQUIRES authentication (default verify_jwt = true)

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { activity_type, params = {}, max_size = 5 } = await req.json();

    if (!activity_type) {
      return new Response(JSON.stringify({ error: "Missing activity_type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    });

    // Get authenticated user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    // 1) Find an open group for this activity
    const { data: groups, error: groupsError } = await supabase
      .from("groups")
      .select("id, max_size, is_open, params")
      .eq("activity_type", activity_type)
      .eq("is_open", true)
      .limit(10);

    if (groupsError) throw groupsError;

    // Helper to count members
    const hasCapacity = async (groupId: string, maxSize: number) => {
      const { count, error } = await supabase
        .from("group_members")
        .select("id", { count: "exact", head: true })
        .eq("group_id", groupId);
      if (error) throw error;
      return (count ?? 0) < maxSize;
    };

    // Try to find a group with capacity
    let chosenGroupId: string | null = null;
    if (groups && groups.length > 0) {
      for (const g of groups) {
        const ok = await hasCapacity(g.id, g.max_size);
        if (ok) {
          chosenGroupId = g.id;
          break;
        }
      }
    }

    // 2) If none found, create a new group
    if (!chosenGroupId) {
      const { data: newGroup, error: createError } = await supabase
        .from("groups")
        .insert({
          name: `${activity_type.charAt(0).toUpperCase() + activity_type.slice(1)} Group`,
          activity_type,
          params,
          created_by: userId,
          max_size: max_size,
          is_open: true,
        })
        .select("id")
        .single();
      if (createError) throw createError;
      chosenGroupId = newGroup.id;
    }

    // 3) Add the user as a member (idempotent thanks to unique constraint)
    const { error: memberError } = await supabase
      .from("group_members")
      .insert({ group_id: chosenGroupId, user_id: userId });

    if (memberError && !memberError.message.includes("duplicate")) {
      // Ignore duplicates; otherwise rethrow
      throw memberError;
    }

    return new Response(JSON.stringify({ group_id: chosenGroupId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("search-and-join error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
