export const USER_API = "http://localhost:5001/user";
export const POST_API = "http://localhost:5001/post";
export const MESSAGE_API = "http://localhost:5001/message";

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
  
