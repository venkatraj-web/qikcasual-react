
export const apiErrorHandler = (error) => {
    if(!error?.response){
        return "No Server Response";
    } else if(error.response?.status === 422){
        // console.log(error.response.data)
        return error.response.data;
    } else if(error.response?.status === 401){
        // console.log(error.response);
        if(error.response.data.message === 'Password Wrong!!'){
            return error.response.data;
        }else{
            localStorage.removeItem('token')
            localStorage.removeItem('expiration')
            window.location.reload();
            return {
                statusCode: error.response.status,
                statusMsg: error.response.statusText
            };
        }
        // return redirect("/admin/login");
    } else{
        return error.response.data;
    }
}