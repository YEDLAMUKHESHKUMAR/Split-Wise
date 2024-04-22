import Login from "../components/Login";
const GoToLogin = () => {
  return (
    <div>
      {(window.location.href = window.location.origin + "/login")}
      <Login />
    </div>
  );
};

export default GoToLogin;
