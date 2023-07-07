import { redirect } from "react-router-dom";

export function getTokenDuration(){
    const storedExpirationDate = localStorage.getItem("expiration");
    const expirationDate = new Date(storedExpirationDate);
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();
    return duration;
}


export const getAuthToken = () => {
    const token = localStorage.getItem("token");

    const tokenExpiration = getTokenDuration();
    if(!token){
        return null;
    }

    if(tokenExpiration < 0){
        return 'EXPIRED';
    }

    return token;
}

export const loader = () => {
    return getAuthToken();
}

export function checkAuthLoader(){
    const token = getAuthToken();

    if(!token || token === "EXPIRED"){
        return redirect("/admin/login");
    }
    return null;
}

export const getRolesByAuthRole = (authRole) => {
    let roles = [];
    switch (authRole){
        case "super-admin":
            roles = [
                {"id": "super-admin", "name": "Super Admin"},
                {"id": "admin", "name": "Admin"},
                {"id": "sales", "name": "Sales"},
                {"id": "ad-sales", "name": "Ad Sales"},
                {"id": "customer-success", "name": "Customer Success"},
                {"id": "client-success", "name": "Client Success"},
                {"id": "casual-success", "name": "Casual Success"}
            ];
            break;
        case "admin":
            roles = [
                {"id": "admin", "name": "Admin"},
                {"id": "sales", "name": "Sales"},
                {"id": "ad-sales", "name": "Ad Sales"},
                {"id": "customer-success", "name": "Customer Success"},
                {"id": "client-success", "name": "Client Success"},
                {"id": "casual-success", "name": "Casual Success"}
              ];
            break;
        case "sales":
            roles = [
                {"id": "ad-sales", "name": "Ad Sales"},
              ];;
            break;
        case "customer-success":
            roles = [
                {"id": "client-success", "name": "Client Success"},
                {"id": "casual-success", "name": "Casual Success"}
              ];;
            break;
        case "ad-sales":
        case "client-success":
        case "casual-success":
        default:
            roles = [];
    }

    return roles;
}
