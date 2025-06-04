import { useEffect } from "react";
import { FaGithub } from "react-icons/fa";

function Login() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");
    const avatar = params.get("avatar_url");
    const name = params.get("name");

    if (username) {
      localStorage.setItem("github_username", username);
      if (avatar) localStorage.setItem("github_avatar", avatar);
      if (name) localStorage.setItem("github_name", name);

      window.location.href = "/";
    }
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:8080/api/auth/github";
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Gitflow</h1>
        <p className="mb-6 text-gray-600">
          Get insights on your squad’s Git Health.
        </p>
        <button
          onClick={handleLogin}
          className="bg-black hover:bg-gray-900 text-white flex items-center justify-center px-6 py-3 rounded-xl text-lg font-medium transition duration-200 w-full cursor-pointer"
        >
          <FaGithub className="mr-2 text-xl" />
          Login with GitHub
        </button>
      </div>
    </div>
  );
}

export default Login;
