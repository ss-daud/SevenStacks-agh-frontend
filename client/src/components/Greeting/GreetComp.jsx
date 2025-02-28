const GreetComp = (user) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 18) return "Good Morning";
        return "Good Evening";
    }; 
    const uname = (user.username).charAt(0).toUpperCase() + user.username.slice(1);
    return <span className="text-[2rem] font-bold">{getGreeting()}! 🌞   {uname}</span>;
};

export default GreetComp;
