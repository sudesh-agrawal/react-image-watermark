import React, { useState } from 'react'
import ImageUploading, { ImageListType } from 'react-images-uploading'

const Uploader = () => {
  const [images, setImages] = React.useState([])
  const [convertedImage, setConvertedImage] = useState<any>(undefined)
  const [error, setError] = useState(null)

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex)
    setImages(imageList as never[])
  }

  function fileToDataUri(field: any) {
    return new Promise(resolve => {
      const reader = new FileReader()

      reader.addEventListener('load', () => {
        resolve(reader.result)
      })

      reader.readAsDataURL(field)
    })
  }

  const handleWatermark = async (file: any, watermarkText: string) => {
    const originalImage: any = document.querySelector('#originalImage')
    originalImage!.src = await fileToDataUri(file)

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    const canvasWidth = originalImage.width
    const canvasHeight = originalImage.height

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // initializing the canvas with the original image
    context!.drawImage(originalImage, 0, 0, canvasWidth, canvasHeight)

    // adding a blue watermark text in the bottom right corner
    context!.fillStyle = 'rgba(0,0,255,0.5)'
    context!.textBaseline = 'middle'
    context!.font = 'bold 25px serif'
    context!.fillText(watermarkText, canvasWidth - 400, canvasHeight - 200)

    setConvertedImage(canvas.toDataURL())
    return canvas.toDataURL()
  }

  return (
    <>
      <ImageUploading
        value={images}
        onChange={onChange}
        resolutionWidth={500}
        resolutionHeight={500}>
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              {...dragProps}>
              Click or Drop here
            </button>
            &nbsp;
            <button onClick={onImageRemoveAll}>Remove</button>
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img
                  style={{
                    position: 'absolute',
                    left: '-999px',
                    maxWidth: '500px',
                    maxHeight: '700px',
                  }}
                  id="originalImage"
                  src={image.dataURL}
                  alt=""
                />
                <div className="image-item__btn-wrapper">
                  <button
                    onClick={() =>
                      handleWatermark(image.file, 'This is a watermark')
                    }>
                    Generate
                  </button>
                </div>
              </div>
            ))}
            {error && <div>Max resolution exceeded</div>}
          </div>
        )}
      </ImageUploading>
      {convertedImage && <img src={convertedImage} alt="with watermark" />}
    </>
  )
}

export default Uploader
