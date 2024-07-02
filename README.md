# React Doc Previewer

React Doc Previewer is a versatile React component library designed to facilitate the previewing of various image and pdf formats within your React applications.

## Features
Pdf Preview: Display previews for pdf documents.
Image Preview: Preview images in various formats such as JPEG, PNG .
Responsive: Ensures a responsive viewing experience across devices.

## Installation
You can install the package via npm or yarn:
```js
npm i react-doc-previewer
```

## Usage
```jsx
  const [show, setShow] = useState(false)
  const [document, setDocument] = useState({ url: IMAGE_URL, type: "image" });
  return (
      <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        <DocPreviewer type={im.type} variant={'full'} url={im.url} show={count} onClose={() => setCount(false)} />
        <button onClick={() => setCount(true)} >show</button>
        <button
          onClick={() => {
            setIm((prev) => (prev.type === "image" ? {
              url: PDF,
              type: "pdf"
            } : {
              url: IMAGE_URL2,
              type: "image"
            }));
          }}
        >
          switch
        </button>
      </div>
```

## Props
Component Props
- type: image | pdf 
- variant: full | inherit | [number, number]  
- show: boolean
- onClose: () => {}
- url: url of the document

## License
This project is licensed under the MIT License.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.
