const CLOUDINARY_CLOUD_NAME = "dh81vvqax";
const CLOUDINARY_UPLOAD_PRESET = "admin_panel";

export async function subirImagenCloudinary(archivo) {
  const formData = new FormData();
  formData.append("file", archivo);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  //formato de como va construir la url cuando se guarde una foto
  const endpoint =
    "https://api.cloudinary.com/v1_1/" +
    CLOUDINARY_CLOUD_NAME +
    "/image/upload";

  const respuesta = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!respuesta.ok) {
    const errorData = await respuesta.json();
    throw new Error(errorData.error?.message || "Error al subir la imagen");
  }

  const datos = await respuesta.json();

  return datos.secure_url;
}
