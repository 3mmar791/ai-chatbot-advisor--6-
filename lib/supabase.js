import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signUp = async (email, password, fullName) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Password reset function with redirectTo
export const resetPassword = async (email, redirectTo) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Chat helper functions
export const saveChat = async (title, messages, userId) => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .insert([
        {
          title,
          messages,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const getUserChats = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const updateChatTitle = async (chatId, newTitle) => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .update({ title: newTitle })
      .eq("id", chatId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const updateChatMessages = async (chatId, messages) => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .update({ messages })
      .eq("id", chatId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const deleteChat = async (chatId) => {
  try {
    const { error } = await supabase.from("chats").delete().eq("id", chatId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};
