import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'shake': {
					'0%, 100%': {
						transform: 'translateX(0)'
					},
					'10%, 30%, 50%, 70%, 90%': {
						transform: 'translateX(-10px)'
					},
					'20%, 40%, 60%, 80%': {
						transform: 'translateX(10px)'
					}
				},
				'slide-out-left': {
					from: {
						transform: 'translateX(0)',
						opacity: '1'
					},
					to: {
						transform: 'translateX(-100%)',
						opacity: '0'
					}
				},
				'hand-slide-in': {
					'0%': {
						left: '-200px',
						opacity: '0'
					},
					'30%': {
						opacity: '1'
					},
					'100%': {
						left: '20%',
						opacity: '1'
					}
				},
				'cloth-drag': {
					'0%': {
						transform: 'translateX(0) rotateY(0deg) scale(1)',
						filter: 'blur(0px)'
					},
					'30%': {
						transform: 'translateX(-10px) rotateY(-2deg) scale(0.98)',
						filter: 'blur(0.5px)'
					},
					'60%': {
						transform: 'translateX(-40px) rotateY(-8deg) scale(0.9)',
						filter: 'blur(1px)'
					},
					'100%': {
						transform: 'translateX(-120%) rotateY(-25deg) scale(0.7)',
						filter: 'blur(2px)',
						opacity: '0'
					}
				},
				'portal-emerge': {
					'0%': {
						transform: 'scale(0) rotate(0deg)',
						opacity: '0'
					},
					'50%': {
						opacity: '0.7'
					},
					'100%': {
						transform: 'scale(1) rotate(360deg)',
						opacity: '1'
					}
				},
				'portal-spin': {
					from: {
						transform: 'rotate(0deg)'
					},
					to: {
						transform: 'rotate(360deg)'
					}
				},
				'portal-pulse': {
					'0%, 100%': {
						transform: 'translate(-50%, -50%) scale(1)'
					},
					'50%': {
						transform: 'translate(-50%, -50%) scale(1.1)'
					}
				},
				'fiber-float': {
					'0%': {
						opacity: '1',
						transform: 'translate(0, 0) rotate(0deg)'
					},
					'100%': {
						opacity: '0',
						transform: 'translate(100px, -50px) rotate(180deg)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)'
					},
					'50%': {
						transform: 'translateY(-20px) rotate(5deg)'
					}
				},
				'float-delayed': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)'
					},
					'50%': {
						transform: 'translateY(-15px) rotate(-3deg)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'shake': 'shake 0.5s ease-in-out',
				'slide-out-left': 'slide-out-left 1s ease-in-out',
				'hand-slide-in': 'hand-slide-in 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
				'cloth-drag': 'cloth-drag 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
				'portal-emerge': 'portal-emerge 2s ease-out forwards',
				'portal-spin': 'portal-spin 3s linear infinite',
				'portal-pulse': 'portal-pulse 2s ease-in-out infinite',
				'fiber-float': 'fiber-float 2s ease-out forwards',
				'float': 'float 6s ease-in-out infinite',
				'float-delayed': 'float-delayed 8s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
