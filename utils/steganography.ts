

export interface EncodeParams {
  messageLength: number
  pixelOffset: number
  pixelStep: number
  colorChannel: number
  checksum: number
  timestamp: number
}

export function messageToBinary(message: string): string {
  return message
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("")
}

export function binaryToMessage(binary: string): string {
  const chars = []
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8)
    if (byte.length === 8) {
      chars.push(String.fromCharCode(Number.parseInt(byte, 2)))
    }
  }
  return chars.join("")
}

export function encodeMessageInImage(imageData: ImageData, message: string, params: EncodeParams): ImageData {
  const { pixelOffset, pixelStep, colorChannel } = params
  const messageBinary = messageToBinary(message)
  const data = new Uint8ClampedArray(imageData.data)

  const messageIndex = 0
  let pixelIndex = pixelOffset * 4

  const lengthBinary = message.length.toString(2).padStart(32, "0")

  // Encoder la longueur
  for (let i = 0; i < 32; i++) {
    if (pixelIndex + colorChannel < data.length) {
      const bit = Number.parseInt(lengthBinary[i])
      data[pixelIndex + colorChannel] = (data[pixelIndex + colorChannel] & 0xfe) | bit
      pixelIndex += pixelStep * 4
    }
  }


  for (let i = 0; i < messageBinary.length; i++) {
    if (pixelIndex + colorChannel < data.length) {
      const bit = Number.parseInt(messageBinary[i])
      data[pixelIndex + colorChannel] = (data[pixelIndex + colorChannel] & 0xfe) | bit
      pixelIndex += pixelStep * 4
    }
  }

  return new ImageData(data, imageData.width, imageData.height)
}

export function decodeMessageFromImage(imageData: ImageData, params: EncodeParams): string {
  const { pixelOffset, pixelStep, colorChannel } = params
  const data = imageData.data

  let pixelIndex = pixelOffset * 4
  let binaryLength = ""

  for (let i = 0; i < 32; i++) {
    if (pixelIndex + colorChannel < data.length) {
      binaryLength += (data[pixelIndex + colorChannel] & 1).toString()
      pixelIndex += pixelStep * 4
    }
  }

  const messageLength = Number.parseInt(binaryLength, 2)
  if (messageLength <= 0 || messageLength > 10000) {
    throw new Error("Longueur de message invalide")
  }

  let messageBinary = ""
  for (let i = 0; i < messageLength * 8; i++) {
    if (pixelIndex + colorChannel < data.length) {
      messageBinary += (data[pixelIndex + colorChannel] & 1).toString()
      pixelIndex += pixelStep * 4
    }
  }

  return binaryToMessage(messageBinary)
}

export function createCanvasFromImage(
  imageSrc: string,
): Promise<{ canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Impossible de créer le contexte canvas"))
        return
      }

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      resolve({ canvas, ctx })
    }
    img.onerror = () => reject(new Error("Erreur lors du chargement de l'image"))
    img.src = imageSrc
  })
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error("Erreur lors de la conversion en PNG"))
        }
      },
      "image/png",
      1.0,
    )
  })
}
