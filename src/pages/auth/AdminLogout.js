import { redirect } from "react-router-dom";

export const action = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("role");
    return redirect("/admin/login");
}