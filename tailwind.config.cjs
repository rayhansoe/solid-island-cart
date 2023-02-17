/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				blue: {
					550: "#06f",
				},
			},
			scale: {
				103: "1.03",
			},
		},
	},
	plugins: [],
};
