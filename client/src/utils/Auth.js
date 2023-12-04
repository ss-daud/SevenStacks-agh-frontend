export const getAutToken = () => {
    const token = localStorage.getItem("token");
    return token;
}