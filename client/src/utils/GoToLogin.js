import Login from "../components/Login";
const GoToLogin = () => {
  return (
    <div>
      {(window.location.href = "/login")}
      <Login />
    </div>
  );
};

export default GoToLogin;
