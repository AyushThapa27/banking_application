import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <div className="container-fluid row">
      <div className="col-6 offset-1 mt-5">
        <img
          src="media/LoginImg.jpg "
          alt="LoginImg"
          style={{ widows: "100%" }}
        />
      </div>
      <div className="col mt-5">
        <LoginForm />
      </div>
    </div>
  );
}
