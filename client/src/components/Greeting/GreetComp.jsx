const GreetComp = (user) => {
    
    const uname = (user.username).charAt(0).toUpperCase() + user.username.slice(1);
    return <span className="text-[2rem] font-bold">Hi!   {uname}</span>;
};

export default GreetComp;
