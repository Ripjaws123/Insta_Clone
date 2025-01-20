export const USER_API = "https://instaconnect-7g68.onrender.com/user";
export const POST_API = "https://instaconnect-7g68.onrender.com/post";
export const MESSAGE_API = "https://instaconnect-7g68.onrender.com/message";

export const readFileDatauri = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result); // Successfully resolve the Data URI
        } else {
          reject(new Error("File reading failed"));
        }
      };
  
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      
      reader.readAsDataURL(file); // Read file as Data URI
    });
  };
  
