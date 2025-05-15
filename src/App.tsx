import { Suspense, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DocPreviewer from '../packages';
import { PDFCanvas } from '../packages/pdf';

const IMAGE_URL =
  "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg";
const IMAGE_URL2 = "https://pixlr.com/images/index/ai-image-generator-one.webp";
const IMAGE_URL3 =
  "https://grants.gettyimages.com/images/grants/GettyImages-1229275252.png";
const IMAGE_URL4 =
  "https://cdn.openart.ai/stable_diffusion/3aa176be81f4eb05a0ac1d3529537f16f3769888_2000x2000.webp";
const PDF = "https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK";
function getFileTypeWithRegex(url) {
  const regex = /(?:\.([^.]+))?$/; // Regular expression to capture file extension
  const extension = regex.exec(url)[1]; // Extract extension from URL
  return extension ? extension.toLowerCase() : 'No extension found';
}
function App() {
  const [count, setCount] = useState(true)
  const [im, setIm] = useState({ url: PDF, type: "pdf" });

  return (
    <>
      <div>
        <DocPreviewer type={im.type} variant={'full'} url={im.url} show={count} onClose={() => setCount(false)} />
      </div>
      <button
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
        }}
        onClick={() => setCount(true)}>show</button>
      <button style={{
        position: "absolute",
        top: "10px",
        left: "10px",
      }}
        onClick={() => setCount(false)}>hide</button>
      <button style={{
        position: "absolute",
        top: "10px",
        left: "10px",
      }}
        onClick={() => {
          setIm((prev) => (prev.type === "image" ? {
            url: PDF,
            type: "pdf"
          } : {
            url: IMAGE_URL,
            type: "image"
          }));
        }}
      >
        seitch
      </button>
    </>
  )
}

export default App
