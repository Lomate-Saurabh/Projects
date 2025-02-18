import { useState } from "react";
import axios from "axios";

export function Signup() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(userData);

    try {
      const response = await axios.post("user/signup", userData);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <form
          onSubmit={submitHandler}
          encType="multipart/form-data"
          method="post"
        >
          <input
            type="text"
            name="username"
            onChange={(e) =>
              setUserData((v) => ({ ...v, username: e.target.value }))
            }
          />
          <input
            type="text"
            name="email"
            onChange={(e) =>
              setUserData((v) => ({ ...v, email: e.target.value }))
            }
          />
          <input
            type="password"
            name="password"
            onChange={(e) =>
              setUserData((v) => ({ ...v, password: e.target.value }))
            }
          />
          <input
            type="file"
            name="avatar"
            onChange={(e) =>
              setUserData((v) => ({ ...v, avatar: e.target.value }))
            }
          />
          <button type="submit">Signup</button>
        </form>
      </div>
    </>
  );
}

// export default fetch_signup = async () => {
//   try {
//     const response = await axios.post("/user/signup", {
//       username,
//       email,
//       password,
//       avatar,
//     });
//     console.log(response.data);
//   } catch (error) {}
// };
