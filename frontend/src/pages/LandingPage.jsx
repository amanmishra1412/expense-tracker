import { useNavigate } from "react-router-dom";
 
const LandingPage = () => {
    const navigate = useNavigate();
 
    return (
        <div className="min-h-screen" style={{ background: "var(--bg-main)", fontFamily: "'DM Sans', sans-serif" }}>
 
            {/* NAV */}
            <nav className="bg-card sticky top-0 z-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <span className="font-bold text-xl" style={{ fontFamily: "'Sora', sans-serif" }}>
                        <span className="text-primary">Kharcha</span>
                        <span style={{ color: "var(--accent)" }}>Track</span>
                    </span>
                    <ul className="hidden md:flex gap-8 list-none">
                        {["Features", "How it works", "Contact"].map((item) => (
                            <li key={item}>
                                <a href={`#${item.toLowerCase().replace(" ", "-")}`}
                                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors no-underline">
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-opacity border-0 cursor-pointer"
                        style={{ background: "linear-gradient(to right, var(--primary-from), var(--primary-to))" }}
                    >
                        Login karein
                    </button>
                </div>
            </nav>
 
            {/* HERO */}
            <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full mb-5"
                        style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }}></span>
                        Smart Expense Management
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-5"
                        style={{ fontFamily: "'Sora', sans-serif", color: "var(--text-dark)" }}>
                        Apne{" "}
                        <span className="text-primary">kharche</span>{" "}
                        ko samjhein,<br />bachat badhaein
                    </h1>
                    <p className="text-slate-500 text-lg leading-relaxed mb-8">
                        KharchaTrack se apne daily expenses track karein, budget set karein,
                        aur financial goals achieve karein — sab ek jagah.
                    </p>
                    <div className="flex flex-wrap gap-4 mb-8">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="px-7 py-3 rounded-xl text-white font-semibold text-base border-0 cursor-pointer transition-all hover:-translate-y-0.5"
                            style={{ background: "linear-gradient(to right, var(--primary-from), var(--primary-to))", boxShadow: "0 4px 15px rgba(30,111,217,0.3)" }}
                        >
                            Abhi shuru karein →
                        </button>
                        <button
                            className="px-7 py-3 rounded-xl font-semibold text-base bg-transparent cursor-pointer transition-all hover:bg-blue-50 border"
                            style={{ color: "var(--primary-to)", borderColor: "var(--primary-to)" }}
                        >
                            Demo dekhein
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-5">
                        {["Free mein shuru karein", "No credit card needed", "100% Secure"].map((t) => (
                            <div key={t} className="flex items-center gap-2 text-sm text-slate-500">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: "var(--accent-soft)" }}>
                                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="2,6 5,9 10,3" />
                                    </svg>
                                </div>
                                {t}
                            </div>
                        ))}
                    </div>
                </div>
 
                {/* MOCKUP CARD */}
                <div className="bg-card rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                    <div className="flex items-center gap-3 px-5 py-4"
                        style={{ background: "linear-gradient(to right, var(--primary-from), var(--primary-to))" }}>
                        <div className="flex gap-1.5">
                            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                                <span key={c} className="w-3 h-3 rounded-full block" style={{ background: c }}></span>
                            ))}
                        </div>
                        <span className="text-white text-xs opacity-80 font-medium">KharchaTrack — Dashboard</span>
                    </div>
                    <div className="p-5">
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {[
                                { label: "Income", val: "₹52,000", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
                                { label: "Expenses", val: "₹34,280", color: "#dc2626", bg: "#fff1f2", border: "#fecdd3" },
                                { label: "Balance", val: "₹17,720", color: "#1e6fd9", bg: "#eff6ff", border: "#bfdbfe" },
                            ].map((s) => (
                                <div key={s.label} className="p-3 rounded-xl text-center"
                                    style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                                    <div className="text-xs text-slate-500 mb-1 font-medium">{s.label}</div>
                                    <div className="text-base font-bold" style={{ color: s.color, fontFamily: "'Sora', sans-serif" }}>{s.val}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2 mb-4">
                            {[
                                { icon: "🛒", name: "Big Basket", date: "Aaj, 10:30 AM", amount: "-₹1,240", neg: true },
                                { icon: "💼", name: "Salary Credit", date: "1 Apr", amount: "+₹52,000", neg: false },
                                { icon: "🍕", name: "Zomato", date: "Kal, 8:15 PM", amount: "-₹349", neg: true },
                            ].map((item) => (
                                <div key={item.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                                        style={{ background: item.neg ? "#fef9c3" : "#dcfce7" }}>
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs font-semibold" style={{ color: "var(--text-dark)" }}>{item.name}</div>
                                        <div className="text-xs" style={{ color: "var(--neutral)" }}>{item.date}</div>
                                    </div>
                                    <div className="text-sm font-bold" style={{ color: item.neg ? "#dc2626" : "#16a34a" }}>{item.amount}</div>
                                </div>
                            ))}
                        </div>
                        {[
                            { label: "Khana", val: "₹8,200 / ₹10,000", pct: 82, color: "var(--primary-to)" },
                            { label: "Travel", val: "₹2,100 / ₹5,000", pct: 42, color: "var(--accent)" },
                        ].map((b) => (
                            <div key={b.label} className="mb-2">
                                <div className="flex justify-between text-xs text-slate-400 mb-1">
                                    <span>{b.label}</span><span>{b.val}</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.color }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
 
            {/* FEATURES */}
            <section id="features" className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>Features</div>
                <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>Sab kuch ek jagah milega</h2>
                <p className="text-slate-500 text-base leading-relaxed max-w-xl mb-12">
                    Chahe daily kharche track karne hon ya monthly savings calculate — KharchaTrack har cheez aasaan bana deta hai.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { icon: "📊", title: "Smart Dashboard", desc: "Income, expenses aur balance ek glance mein. Graphs se samjhein paisa kahan ja raha hai.", bg: "#eff6ff" },
                        { icon: "🏷️", title: "Category Management", desc: "Food, travel, rent — apni zaroorat ke hisaab se categories banayein aur budgets set karein.", bg: "#f0fdf4" },
                        { icon: "🔔", title: "Budget Alerts", desc: "Jab budget limit ke paas pahunche to notification milegi. Kabhi overspend mat karein.", bg: "var(--accent-soft)" },
                        { icon: "📁", title: "Expense History", desc: "Purane saare transactions ek jagah. Filter aur search karke koi bhi kharcha dhundhein.", bg: "#fff7ed" },
                        { icon: "📈", title: "Monthly Reports", desc: "Har mahine ka detailed report dekhe aur jaanein kahan improvement ki zaroorat hai.", bg: "#fdf4ff" },
                        { icon: "🔒", title: "100% Secure", desc: "Aapka data fully encrypted hai. Koi bhi aapki financial information access nahi kar sakta.", bg: "#fff1f2" },
                    ].map((f) => (
                        <div key={f.title}
                            className="bg-card p-7 rounded-2xl border border-slate-200 hover:-translate-y-1 hover:shadow-xl transition-all cursor-default group relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ background: "linear-gradient(to right, var(--primary-from), var(--primary-to))" }}></div>
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
                                style={{ background: f.bg }}>{f.icon}</div>
                            <h3 className="text-base font-semibold mb-2" style={{ color: "var(--text-dark)", fontFamily: "'Sora', sans-serif" }}>{f.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
 
            {/* STATS */}
            <section className="py-16 text-center"
                style={{ background: "linear-gradient(135deg, var(--primary-from), var(--primary-to))" }}>
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-xs font-semibold uppercase tracking-widest text-white opacity-60 mb-3">Numbers jo bolte hain</div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-10" style={{ fontFamily: "'Sora', sans-serif" }}>
                        Hamaare saath lakhs users badha rahe hain apni bachat
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {[
                            { val: "2L+", label: "Active Users" },
                            { val: "₹50Cr+", label: "Expenses Tracked" },
                            { val: "4.8★", label: "User Rating" },
                        ].map((s) => (
                            <div key={s.label}>
                                <div className="text-4xl font-bold text-white mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>{s.val}</div>
                                <div className="text-sm text-white opacity-70">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
 
            {/* HOW IT WORKS */}
            <section id="how-it-works" className="bg-card py-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>How it works</div>
                    <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Sora', sans-serif" }}>3 simple steps mein shuru karein</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
                        {[
                            { num: 1, title: "Account Banayein", desc: "Sirf email se signup karein. Ek minute se bhi kam lagega." },
                            { num: 2, title: "Kharche Add Karein", desc: "Roz ke expenses daalo, categories set karo, budget define karo." },
                            { num: 3, title: "Reports Dekhein", desc: "Insights se samjhein kahan bachat ho sakti hai aur goals achieve karein." },
                        ].map((step) => (
                            <div key={step.num} className="flex flex-col items-center px-4">
                                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold mb-5 relative z-10"
                                    style={{ background: "linear-gradient(to right, var(--primary-from), var(--primary-to))", fontFamily: "'Sora', sans-serif" }}>
                                    {step.num}
                                </div>
                                <h3 className="text-base font-semibold mb-2" style={{ fontFamily: "'Sora', sans-serif", color: "var(--text-dark)" }}>{step.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
 
            {/* CTA */}
            <section className="py-16 px-6">
                <div className="max-w-2xl mx-auto rounded-3xl p-16 text-center relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, var(--primary-from), var(--primary-to))" }}>
                    <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10 bg-white"></div>
                    <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-5 bg-white"></div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 relative z-10" style={{ fontFamily: "'Sora', sans-serif" }}>
                        Aaj hi apni financial journey shuru karein
                    </h2>
                    <p className="text-white opacity-80 mb-8 relative z-10">
                        Free mein join karein. Credit card ki zaroorat nahi. Sirf smarter spending ki taraf ek kadam.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center relative z-10">
                        <button
                            onClick={() => navigate("/")}
                            className="bg-white font-bold px-8 py-3 rounded-xl text-base border-0 cursor-pointer hover:-translate-y-0.5 transition-all"
                            style={{ color: "var(--primary-from)" }}>
                            Free mein shuru karein
                        </button>
                        <button
                            className="font-semibold px-8 py-3 rounded-xl text-base cursor-pointer hover:bg-white/10 transition-all text-white"
                            style={{ border: "1.5px solid rgba(255,255,255,0.5)", background: "transparent" }}>
                            Aur jaanein
                        </button>
                    </div>
                </div>
            </section>
 
            {/* FOOTER */}
            <footer style={{ background: "var(--text-dark)" }} className="pt-12 pb-6">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
                    <div>
                        <div className="font-bold text-xl mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
                            <span className="text-white">Kharcha</span>
                            <span style={{ color: "var(--accent)" }}>Track</span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                            Smart expense tracking jo aapki financial life ko simple aur clear banata hai.
                            Apna paisa samjhein, apna future banayein.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
                        <ul className="list-none flex flex-col gap-2">
                            {["Dashboard", "Expenses", "Add Expense", "Reports"].map((l) => (
                                <li key={l}><a href="#" className="text-sm no-underline hover:text-white transition-colors"
                                    style={{ color: "rgba(255,255,255,0.5)" }}>{l}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
                        <ul className="list-none flex flex-col gap-2">
                            {["About Us", "Privacy Policy", "Terms of Service", "Contact"].map((l) => (
                                <li key={l}><a href="#" className="text-sm no-underline hover:text-white transition-colors"
                                    style={{ color: "rgba(255,255,255,0.5)" }}>{l}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-6 border-t text-center text-xs"
                    style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
                    © 2026 KharchaTrack. Sab rights reserved.
                </div>
            </footer>
        </div>
    );
};
 
export default LandingPage;