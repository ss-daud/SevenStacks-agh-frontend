const GreetComp = (user) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 18) return "Good Morning";
        return "Good Evening";
    }; 
    return <span className="text-[2rem] font-bold">{getGreeting()}! 🌞   {user.username}</span>;
};

export default GreetComp;
