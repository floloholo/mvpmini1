import { supabase, getCurrentUserId } from "./supabase";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface DeepseekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Fetch user profile data from Supabase
export const fetchUserContext = async (): Promise<string> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return "";

    const { data, error } = await supabase
      .from("user_profiles")
      .select("what_do_you_want, what_do_you_really_want, regulars")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      console.error("Error fetching user profile:", error);
      return "";
    }

    // Format the user context
    return `The user has the following goals and routines: They want ${data.what_do_you_want || "to be happy"}. They really want ${data.what_do_you_really_want || "financial freedom and a loving partner"}. ${data.regulars ? `They usually ${data.regulars}.` : ""}`;
  } catch (error) {
    console.error("Error in fetchUserContext:", error);
    return "";
  }
};

// Send message to DeepSeek API
export const sendMessageToDeepseek = async (
  userMessage: string,
  previousMessages: Message[] = [],
): Promise<string> => {
  try {
    const userContext = await fetchUserContext();

    // Prepare messages array
    const messages: Message[] = [
      {
        role: "system",
        content: `You are a helpful assistant that understands the user deeply based on their onboarding goals and prior reflections. ${userContext}`,
      },
      ...previousMessages,
      { role: "user", content: userMessage },
    ];

    // Call DeepSeek API
    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} ${errorData}`);
    }

    const data = (await response.json()) as DeepseekResponse;
    return (
      data.choices[0]?.message?.content ||
      "I'm sorry, I couldn't process your request."
    );
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    return "Sorry, I encountered an error while processing your request. Please try again later.";
  }
};
