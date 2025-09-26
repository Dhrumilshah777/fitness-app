import { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const PhotoUploader = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    const storageRef = ref(storage, `progress/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    setUrl(downloadURL);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button className="bg-purple-500 text-white p-2 mt-2" onClick={handleUpload}>Upload</button>
      {url && <img src={url} alt="progress" className="mt-4 w-32 h-32 object-cover" />}
    </div>
  );
};

export default PhotoUploader;
