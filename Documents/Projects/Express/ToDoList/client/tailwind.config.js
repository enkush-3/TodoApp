module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    safelist: [
        // background
        "bg-white",
        "bg-gray-50", "bg-gray-100", "bg-gray-200", "bg-gray-300", "bg-gray-400",
        "bg-red-500", "bg-red-600", "bg-red-700",
        "bg-blue-500", "bg-blue-600", "bg-blue-700",

        // border
        "border-gray-300", "border-gray-400", "border-gray-500",
        "border-black", "border-white",
        "border-red-500", "border-red-600",
        "border-blue-500", "border-blue-600",

        // text
        "text-black", "text-white",
        "text-gray-700", "text-gray-400",
        "text-red-500", "text-red-600",
        "text-blue-500", "text-blue-600",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
