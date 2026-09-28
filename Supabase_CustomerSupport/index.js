import { openai } from "./config.js"
import { getRagPrompt, combineDocuments } from "./utils.js"
import { ingestDocuments } from "./upsertDocuments.js"
import { ANSWERING_MODEL } from "./constants.js"
import { retrieveSimilarDocs } from "./retrieveSimilarDocs.js"

const query = "How many houses were damaged during the great fire of london?"

async function main() {
  // split text into chunks, embed and store into vector db
  //  await ingestDocuments()

  //retrieve docs that contain content relevant to the query
  const retrievedDocs = await retrieveSimilarDocs(query)
  // console.log("Retrieved docs:", retrievedDocs)

  const contextString = combineDocuments(retrievedDocs);

  /* create a prompt using `getRagPrompt` including contextString */
  const prompt = getRagPrompt(contextString, query)

  /* Implement logic to send the prompt to model to generate response and log the `output_text` */
  const aiResponse = await openai.responses.create({
    model: ANSWERING_MODEL,
    input: prompt
  })

  console.log(aiResponse.output_text);
}

main()
