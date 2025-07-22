
export const generateContentWithGemini = async (
  message: string,
  style: string
): Promise<string> => {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!API_KEY) throw new Error("Clé API Gemini manquante");

  
  const stylePrompts: Record<string, string> = {
    meme: "en une punchline de meme drôle et accrocheuse",
    poetic: "de manière poétique avec des métaphores élégantes",
    romantic: "de façon romantique et touchante",
    professional: "sous forme d'excuse professionnelle polie et formelle",
    sarcastic: "avec un ton sarcastique et ironique",
  };

  const prompt = `Reformule ce message en style ${stylePrompts[style] + ' de manière créative'}. Ne retourne QUE le message reformaté sans commentaires, sans guillemets et sans texte supplémentaire. Message: ${message}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        },
      },
  )}
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Erreur API Gemini");
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || message;
};