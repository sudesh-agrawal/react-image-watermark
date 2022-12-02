import React, { useState } from 'react'
import ImageUploading, { ImageListType } from 'react-images-uploading'

const Uploader = () => {
  const [images, setImages] = React.useState([])
  const [convertedImage, setConvertedImage] = useState<any>(undefined)
  const [error, setError] = useState(false)

  function getImageDimensions(file: any) {
    return new Promise(function (resolved, rejected) {
      var i = new Image()
      i.onload = function () {
        resolved({ w: i.width, h: i.height })
      }
      i.src = file
    })
  }

  const onChange = async (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit

    if (imageList.length > 0) {
      const dimensions: any = await getImageDimensions(imageList[0].dataURL)
      console.log(dimensions, 'dimension')

      if (dimensions!.w > 512 || dimensions!.h > 512) {
        console.log(true)
        setError(true)
        return
      }
    }

    console.log(imageList, addUpdateIndex)
    setError(false)
    setImages(imageList as never[])
    setConvertedImage(undefined)
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
    context!.fillStyle = 'rgba(192,192,192,0.6)'
    context!.shadowOffsetX = 1
    context!.shadowOffsetY = 1
    context!.shadowBlur = 2
    context!.shadowColor = 'black'
    context!.textBaseline = 'middle'
    context!.font = 'bold 25px serif'
    context!.fillText(watermarkText, canvasWidth - 350, canvasHeight - 100)

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
          errors,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button
              style={isDragging ? { color: 'red' } : undefined}
              className="button info"
              onClick={onImageUpload}
              {...dragProps}>
              Click or Drop here
            </button>
            &nbsp;
            {convertedImage && (
              <button
                className="button danger"
                onClick={() => {
                  onImageRemoveAll()
                  setConvertedImage(undefined)
                }}>
                Remove
              </button>
            )}
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
                  {!convertedImage && (
                    <button
                      className="button success"
                      onClick={() =>
                        handleWatermark(image.file, 'This is a watermark')
                      }>
                      Generate
                    </button>
                  )}
                </div>
              </div>
            ))}
            {error && (
              <div className="error-text">
                Max resolution exceeded please select image less than 512 x 512
              </div>
            )}
          </div>
        )}
      </ImageUploading>
      {convertedImage && <img src={convertedImage} alt="with watermark" />}
    </>
  )
}

export default Uploader
