// ? method 1 :

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";


const loader = new PDFLoader("./story.pdf")

const docs = await loader.load()

console.log(docs)

// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize : 10,
//   chunkOverlap:0,
// })


// const chucks = await splitter.splitText(docs)
// console.log(chucks)


// ? method 2 :

// import pdf from "pdf-parse"
// import fs from "fs"

// let dataBuffer = fs.readFileSync("./story.pdf")

// const data = await pdf(dataBuffer)

// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 200,
//   chunkOverlap: 0
// })

// const chucks = await splitter.splitText(data.text)

// console.log(chucks)


// ? method 3 :

// import PdfParse  from "pdf-parse"
// import fs from "fs"


// let dataBuffer = fs.readFileSync("./story.pdf")

// const parser = await PdfParse(dataBuffer)

// // const data = await parser.getText()

// console.log(parser)