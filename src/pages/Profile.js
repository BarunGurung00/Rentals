import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../Components/nav';
import { useAuth } from '../Components/auth';
import { TbCameraPlus } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";

const Profile = () => {
  const fileInputRef = useRef(null);
  const auth = useAuth();
  const navigate = useNavigate();

  // // State to store the user data
  const [userData, setUserData] = useState(null);
  const [editStatus, setEditStatus] = useState(false);  
  
  const [imageSrc, setImageSrc] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = auth.token;
        if (!token) return;
  
        const response = await fetch("http://localhost:4000/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        });
  
        const data = await response.json();
        if (data.success){
          const user = data.user;
          setUserData(user);
          setName(user.name || "");
          setEmail(user.email || "");
          setNumber(user.number || "");
          setImageSrc(user.image || null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);

  const handleLogOut = () => {
    auth.logout(); // Ensure this clears authentication data
    navigate('/SignIn'); // Redirect to SignIn page
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    outline: "none",
    textAlign: "center",
    display: "block",
    margin: "0 auto",
    transition: "border-color 0.3s",
  };

  const handleIconClick = () => {
    fileInputRef.current.click(); // Trigger the file input click
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        
        img.onload = () => {
          // Create a canvas to resize the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set the desired width and height for the resized image
          const maxWidth = 300; // Max width of the resized image
          const maxHeight = 300; // Max height of the resized image
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          // Resize the image on the canvas
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert the canvas to a base64-encoded image
          const resizedImage = canvas.toDataURL('image/jpeg'); // You can use 'image/png' too
          setImageSrc(resizedImage); // Set the resized image to state
        };
      };
      
      reader.readAsDataURL(file); // Read the file as a data URL (base64)
    }
  };
  

  const HandleEdit = async() => {
      const token = auth.token;
  
      if (!token) {
        alert("User not authenticated!");
        return;
      }
    
      try {
        const response = await fetch("http://localhost:4000/updateuserdetails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name, email, number, password, image: imageSrc })
        });
    
        const data = await response.json();
    
        if (data.success) {
          // Update the user data in the context
          auth.login({  email: data.email, name, number, image: imageSrc }, data.token);

          alert("Profile updated successfully!");
          setEditStatus(false); // Hide edit form
        } else {
          alert("Failed to update profile: " + data.error);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("An error occurred while updating profile.");
      }

  }

  return (
    <div>
       <Nav />

       <div style={{width:"70%", margin:"auto"}}>
       
       {/* This is a conditional component */}
       {   
          editStatus ?
           <div style={{ textAlign: "center", marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px"}}>

              <div style={{color:"red", textAlign:"left", cursor:"pointer"}} onClick={()=>setEditStatus(false)}>Cancel</div>
              <div style={{ position: "relative", width: "150px", height: "150px", borderRadius: "50%", border: "3px solid grey", margin: "0 auto" }}>
                { imageSrc ?
                    <img
                    src={imageSrc}
                    alt="Profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                  /> :
                  <CgProfile size={150} style={{ color: "grey" }} />
                }
                <TbCameraPlus size={18} style={{position: "absolute", bottom: "1px", right: "-2px", backgroundColor: "white", borderRadius: "50%", padding: "8px", border: "2px solid gray"}} onClick={handleIconClick} />
                <input ref={fileInputRef} type="file" style={{ display: "none" }} accept="image/*" onChange={handleFileChange} />
              </div>

              <div style={{display:"flex", flexDirection:"column", gap:"5px", alignContent:"start"}}>  
                  <label  style={{display:"block", textAlign:"left"}} htmlFor="name">Name</label>
                  <input type="text" placeholder="Name" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div style={{display:"flex", flexDirection:"column", gap:"5px", alignContent:"start"}}>
                  <label  style={{display:"block", textAlign:"left"}} htmlFor="email">Email</label>
                  <input type="email" placeholder="Email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div style={{display:"flex", flexDirection:"column", gap:"5px", alignContent:"start"}}>
                  <label  style={{display:"block", textAlign:"left"}} htmlFor="number">Phone number</label>
                  <input type="number" placeholder="Phone number" style={inputStyle} value={number} onChange={(e) => setNumber(e.target.value)}/>
              </div>

              <div style={{display:"flex", flexDirection:"column", gap:"5px", alignContent:"start"}}>
                  <label  style={{display:"block", textAlign:"left"}} htmlFor="password">Password</label>
                  <input type="password" placeholder="Password" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button style={{width:"200px", height:"35px", borderRadius:"5px", margin:"auto"}} onClick={()=> HandleEdit()}>Edit</button>
          </div> : 
          
          <div>
             <div style={{ textAlign: "center", marginTop: "20px" }}>

                <div style={{ width: "150px", height: "150px", borderRadius: "50%", border: "3px solid grey", overflow: "hidden", margin: "0 auto" }}>
                    <img 
                      src={imageSrc || "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"} 
                      alt="Profile" 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                </div>
                
                <button onClick={()=>setEditStatus(true)}>Edit</button>
                 
                <h2 style={{ marginTop: "10px", fontSize: "22px", fontWeight: "bold", color: "#333" }}>
                  {userData?.name || "Your Name"}
                </h2>
                 
                <p style={{ fontSize: "16px", color: "gray" }}>
                  {userData?.email || "your.email@example.com"}
                </p>

                <div>
                    <div>
                      My Bookings
                    </div>  
                    <div>
                      My Cars
                    </div>  
                    <div>
                      Post a Car
                    </div>
                </div>


            </div>

          </div>
       }
       
       <button onClick={handleLogOut}>
Log Out
</button>
       </div>
    </div>
  );
};

export default Profile;

