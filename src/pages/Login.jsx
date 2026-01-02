import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Storage } from "../utils/storage";
import { seedAuthUsers } from "../utils/authSeed";
import { seedIfNeeded } from "../utils/seed";

export default function Login() {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    seedAuthUsers();   // create demo users
    seedIfNeeded();    // seed employees, leaves, attendance

    const logged = Storage.get("hrms_user");
    if (logged) nav("/dashboard", { replace: true });
  }, [nav]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const users = Storage.get("hrms_users", []);

    const found = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!found) {
      setError("Invalid username or password");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      Storage.set("hrms_user", {
        id: found.id,
        name: found.name,
        role: found.role,
        username: found.username,
      });

      nav("/dashboard");
    }, 600);
  };

  return (
    <div className="auth-wrap page-anim">
      <div className="auth-bg" />

      <div className="auth-card glass-card hover-lift">
        <h2 className="mt-0">HRMS </h2>
        <p className="muted mb-16">
          Login using your credentials
        </p>

        <form onSubmit={handleLogin}>
          <div className="field">
            <div className="label">Username</div>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin / hr / employee"
              required
            />
          </div>

          <div className="field">
            <div className="label">Password</div>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123 / hr123 / emp123"
              required
            />
          </div>

          {error && (
            <div className="badge danger mb-12">{error}</div>
          )}

          <button
            className="btn primary"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        {/* <div className="mt-16 muted" style={{ fontSize: 12 }}>
          <b>Demo Accounts:</b>
          <br />
          Admin → admin / admin123
          <br />
          HR → hr / hr123
          <br />
          Employee → employee / emp123
        </div> */}
      </div>

      <style>{`
        .auth-wrap{
          min-height: 100vh;
          display:grid;
          place-items:center;
          padding: 22px;
          position: relative;
        }
        .auth-bg{
          position: fixed; inset: 0;
          background:
            linear-gradient(180deg, rgba(7,10,15,0.82), rgba(11,18,32,0.92)),
            url("/auth.jpg") center/cover no-repeat;
          filter: blur(2px);
          transform: scale(1.05);
          z-index:-1;
        }
        .auth-card{
          width: min(460px, 94vw);
        }
      `}</style>
    </div>
  );
}
