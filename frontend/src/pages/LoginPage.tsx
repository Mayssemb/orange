import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/authActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getroleFromToken}  from "@/utils/auth";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Redux state
  const auth = useSelector((state) => state.authReducer);
  const { userInfo, loading, error } = auth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect after login
  useEffect(() => {
    if (userInfo) {
      if (getroleFromToken(userInfo.access_token) === "HR") {
        navigate("/hr");
      } else {
        navigate("/team-lead");
      }
    }
  }, [userInfo, navigate]);

  if (userInfo) {
    return (
      <Navigate
        to={getroleFromToken(userInfo.access_token) === "HR" ? "/hr" : "/team-lead"}
        replace
      />
    );
  }

  const handleLogin = () => {
    if (!email || !password) return;
    dispatch(login(email, password) );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8 gap-3">
          <div className="w-12 h-12 bg-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground leading-tight">
              orange
            </span>
          </div>
          <span className="text-2xl font-bold">Talent Portal</span>
        </div>

        <Card className="card-orange">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                placeholder="jean.martin@orange.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                placeholder="********"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            <Button
              className="w-full"
              disabled={!email || !password || loading}
              onClick={handleLogin}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
