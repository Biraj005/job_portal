import express, { text } from "express";
import cloudinary from "cloudinary";
import { ai } from "../geminit.js";
import { getPrompt, resumeprompt } from "../prompts.js";
import parseNestedError from "../parseerror.js";

const router = express.Router();

router.post("/upload", async (req, res) => {
  try {
    const { buffer, public_id } = req.body;

    if (public_id) {
      await cloudinary.v2.uploader.destroy(public_id);
    }
    const cloude = await cloudinary.v2.uploader.upload(buffer);

    res.json({
      url: cloude.secure_url,
      public_id: cloude.public_id,
    });
  } catch (error: any) {
    res.status(500).json({ error: `Image upload failed ${error.message}` });
  }
});

router.post("/career", async (req, res) => {

  try {
    const { skills } = req.body;
   
    if (!skills) {
      return res.status(400).json({
        success: false,
        message: "Skill required",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: getPrompt(skills),
    });

    let jsonResponse;
    try {
      const rawText: string = response.text || "";

      const cleanedText = rawText
        .replace(/```(?:json)?/gi, "")
        .replace(/```/g, "")
        .trim();
      if (!cleanedText) {
        throw new Error("Ai did not return response");
      }
      try {
        jsonResponse = JSON.parse(cleanedText);
      } catch (error) {
        throw new Error("Invalid JSON response from AI");
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Ai did not return response",
      });
    }
    return res.status(200).json(jsonResponse);
  } catch (error: any) {
    res.status(500).json(parseNestedError(error.message));
  }
});

router.post("/resume-analyser", async (req, res) => {
  try {
    const { pdfBase64 } = req.body;
    if (!pdfBase64) {
      return res.status(400).json({
        success: false,
        message: "Resume is required",
      });
    }

    const promt = resumeprompt;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: promt,
            },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: pdfBase64.replace(/^data:application\/pdf;base64,/, ""),
              },
            },
          ],
        },
      ],
    });
    let jsonResponse;
    try {
      console.log(response.text)
      const rawText: string = response.text??"";
      console.log(rawText,"rawt text")

      const cleanedText = rawText
        .replace(/```(?:json)?/gi, "")
        .replace(/```/g, "")
        .trim();
      console.log(cleanedText)
      if (!cleanedText) {
        throw new Error("Ai did not return response");
      }
      try {
        jsonResponse = JSON.parse(cleanedText);
      } catch (error) {
        throw new Error("Invalid JSON response from AI");
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Ai did not return response",
      });
    }
    return res.status(200).json(jsonResponse);
  } catch (error: any) {
    res.status(500).json(parseNestedError(error.message));
  }
});
export default router;
