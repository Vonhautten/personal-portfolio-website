// ─── HERO ────────────────────────────────────────────────────
export const hero = {
	firstName: 'MUHAMMAD',
	lastName:  'ZUFAR',
	fullName:  'RASYID IBRAHIM',
	roles: [
		'Full Stack Developer',
		'Software Engineer',
		'3D Visual Artist',
		'UI/UX Enthusiast',
	],
	aboutLink: { label: 'About Me →', href: '#profile' },
};

// ─── PROFILE ─────────────────────────────────────────────────
export const profile = {
	name:        'Muhammad Zufar Rasyid Ibrahim',
	role:        'Software Engineering Student & Full Stack Developer',
	photo:       '/image/foto_profile.png',
	school:      'SMKN 1 CIMAHI',
	class:       'XII RPL B',
	statusLabel: 'OPEN',

	stats: [
		{ value: '9',  label: 'PROJECTS',   color: '#B4FF00' },
		{ value: '2',   label: 'AWARDS',     color: '#00E5FF' },
		{ value: '200+',   label: 'CUP OF COFFE',  color: '#8FFF00' },
		{ value: '20+', label: 'TECH STACK', color: '#FF6B6B' },
	],

	bio: [
		{
			text: 'A passionate software engineering student at SMKN 1 Cimahi with a strong interest in programming, technology, and problem-solving. I enjoy learning new concepts and building practical digital solutions from idea to implementation.',
			highlights: [{ word: 'SMKN 1 Cimahi', color: '#B4FF00' }],
		},
		{
			text: 'Hands-on experience in web development, mobile applications, and 3D design — currently working as a Quality Assurance (QA) Intern at PT Neuronworks Indonesia.',
			highlights: [
				{ word: 'web development',     color: '#00E5FF' },
				{ word: 'mobile applications', color: '#8FFF00' },
				{ word: '3D design',           color: '#FF6B6B' },
			],
		},
	],

	highlights: [
		{ text: '1st Place — Future Makers Website UI/UX Competition', sub: 'BINUS University · 2025',              color: '#B4FF00' },
		{ text: 'Top 5 Finalist — Cimahi Motekar Award (ChiMA)',       sub: 'Bappelitbangda Kota Cimahi · 2024',   color: '#00E5FF' },
	],

skills: [
	'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'SvelteKit', 'Three.js', 'TailwindCSS', 'Bootstrap', 'PHP', 'Laravel', 'Java', 'C++', 'C#', 'Android', 'MySQL', 'SQLite', 'Firebase', 'Git', 'Figma', 'Blender'
],

	cta: {
		projects: { label: 'View Projects →', href: '#projects' },
		contact:  { label: 'Contact Me',      href: '#contact'  },
	},
};

// ─── PROJECTS ────────────────────────────────────────────────
export type PatternType = 'circuit' | 'dots' | 'waves' | 'grid' | 'hexagon' | 'cross';

export interface Project {
	id:             string;
	name:           string;
	tagline:        string;
	description:    string;
	tech:           string[];
	year:           string;
	color:          string;
	colorSecondary: string;
	gradient:       string;
	pattern:        PatternType;
	thumbnail:      string | null;
	liveUrl?:       string;
	repoUrl?:       string;
}

export const projects: Project[] = [
	{
		id: '01',
		name: 'School Facilities Management System',
		tagline: 'Asset Tracking & Loan Management Platform',
		description: 'A centralized web-based asset management system designed to manage and monitor school facility equipment. The platform enables real-time inventory tracking, loan and return logging, administrative approval workflows, and detailed usage history to improve accountability and operational efficiency.',
		tech: ['PHP', 'Laravel', 'MySQL', 'TailwindCSS'],
		year: '2024',
		color: '#00E5FF',
		colorSecondary: '#7C4DFF',
		gradient: 'linear-gradient(135deg, #00E5FF 0%, #7C4DFF 100%)',
		pattern: 'hexagon',
		thumbnail: '/image/1.jpg',
	},
	{
		id: '02',
		name: 'Body Buddy',
		tagline: 'Interactive Educational Audio App',
		description: 'An interactive Android application designed to help children learn human body parts through visual and auditory engagement. Users can tap different body sections, including the head, torso, limbs, and organs, to hear corresponding audio explanations, creating a multisensory learning experience.',
		tech: ['Java', 'SQLite', 'Android Studio'],
		year: '2024',
		color: '#FF6B6B',
		colorSecondary: '#FFB86B',
		gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFB86B 100%)',
		pattern: 'circuit',
		thumbnail: '/image/2.jpg',
	},
	{
		id: '03',
		name: 'TaskFlow – To-Do List App',
		tagline: 'Android Productivity Application',
		description: 'A mobile task management application built with Java and SQLite. The app supports full local CRUD operations, gesture-based task deletion, responsive UI layouts, and efficient data persistence for offline usage.',
		tech: ['Java', 'SQLite', 'Android Studio'],
		year: '2024',
		color: '#8A2BE2',
		colorSecondary: '#00CED1',
		gradient: 'linear-gradient(135deg, #8A2BE2 0%, #00CED1 100%)',
		pattern: 'cross',
		thumbnail: '/image/3.jpg',
	},
	{
		id: '04',
		name: 'Z-Mart',
		tagline: 'E-Commerce Platform & Admin Dashboard',
		description: 'A full-featured e-commerce web application with an integrated administrative dashboard for managing products, orders, users, and transactions. Designed with a clean user experience and structured backend logic to ensure scalability and maintainability.',
		tech: ['PHP', 'Laravel', 'MySQL', 'JavaScript', 'TailwindCSS'],
		year: '2025',
		color: '#00FFA3',
		colorSecondary: '#0088FF',
		gradient: 'linear-gradient(135deg, #00FFA3 0%, #0088FF 100%)',
		pattern: 'grid',
		thumbnail: '/image/4.jpg',
	},
	{
		id: '05',
		name: '3D House Interior & Asset Design',
		tagline: 'First Blender Architectural Project',
		description: 'My first Blender project focused on modeling a complete house along with detailed assets for each room. The project includes a bedroom, living room, kitchen, and bathroom, with individually created furniture and interior elements. It emphasizes foundational 3D modeling skills, object scaling, material application, scene organization, and basic lighting setup.',
		tech: ['Blender', 'Cycles Render', 'Basic Interior Modeling'],
		year: '2025',
		color: '#FF9F1C',
		colorSecondary: '#FFBF69',
		gradient: 'linear-gradient(135deg, #FF9F1C 0%, #FFBF69 100%)',
		pattern: 'waves',
		thumbnail: '/image/5.jpg',
	},
	{
		id: '06',
		name: '3D Pirate Ship',
		tagline: 'High-Detail Blender 3D Model',
		description: 'A fully modeled 3D pirate ship featuring sails, cannons, deck structures, barrels, and detailed wooden textures. The project focuses on structural accuracy, material realism, and cinematic rendering using Cycles.',
		tech: ['Blender', 'Cycles Render', 'PBR Texturing'],
		year: '2025',
		color: '#6A4C93',
		colorSecondary: '#1982C4',
		gradient: 'linear-gradient(135deg, #6A4C93 0%, #1982C4 100%)',
		pattern: 'waves',
		thumbnail: '/image/6.jpg',
	},
	{
		id: '07',
		name: '3D Onsen House',
		tagline: 'Collaborative Blender Environment Project',
		description: 'A collaborative Blender project focused on creating a detailed Japanese-style outdoor onsen environment. Special shoutout to Ira and Aneyra for the teamwork and creative collaboration. The scene includes various modeled elements such as trees, traditional house structures, lantern lighting, a stone-built onsen bath, flowing water, grass, and environmental assets. The project emphasizes object detailing, material realism, environmental composition, and cinematic lighting to build a serene and immersive atmosphere.',
		tech: ['Blender', 'Cycles Render', 'Environment Design'],
		year: '2025',
		color: '#2EC4B6',
		colorSecondary: '#CBF3F0',
		gradient: 'linear-gradient(135deg, #2EC4B6 0%, #CBF3F0 100%)',
		pattern: 'dots',
		thumbnail: '/image/7.jpg',
	},
	{
		id: '08',
		name: '3D Stardew Farm',
		tagline: 'Stylized Low-Poly Environment',
		description: 'A stylized 3D farm environment inspired by cozy farming games. The project emphasizes low-poly modeling, layout composition, stylized shading techniques, and warm lighting to create a charming and game-ready aesthetic.',
		tech: ['Blender', 'EEVEE', 'Stylized Shading'],
		year: '2025',
		color: '#FFD166',
		colorSecondary: '#06D6A0',
		gradient: 'linear-gradient(135deg, #FFD166 0%, #06D6A0 100%)',
		pattern: 'grid',
		thumbnail: '/image/8.jpg',
	},
	{
		id: '09',
		name: 'FMIPA UNPAD Faculty Profile Website',
		tagline: 'Dynamic CMS & Institutional Web Platform',
		description: 'A dynamic faculty profile website developed for FMIPA UNPAD with role-based authentication and content management features. The platform allows authorized staff to update layouts, manage articles, edit structured data, and maintain institutional information through a user-friendly interface comparable to a lightweight CMS.',
		tech: ['PHP', 'Laravel', 'React', 'MySQL', 'TailwindCSS'],
		year: '2025',
		color: '#EF476F',
		colorSecondary: '#118AB2',
		gradient: 'linear-gradient(135deg, #EF476F 0%, #118AB2 100%)',
		pattern: 'hexagon',
		thumbnail: '/image/9.jpg',
	}
];

// ─── CONTACT ─────────────────────────────────────────────────
export interface Social {
	id:     string;
	label:  string;
	handle: string;
	href:   string;
	color:  string;
	code:   string;
	tag:    string;
	icon:   string;
}

export const contact = {
	heading:       'REACH',
	headingAccent: 'ME OUT',
	subheading:    "Open for opportunities, collaborations, or just a friendly conversation. Pick your preferred channel — I'll be there.",
	location:      'CIMAHI, INDONESIA',
	timezone:      'WIB (UTC+7)',

	terminalScript: [
		'> initializing contact.sys...',
		'> loading social_links.json',
		'> [OK] 8 channels found',
		'> status: ONLINE ✦',
	],

	socials: [
		{
			id: 'instagram', label: 'Instagram', handle: '@zufarrasyid',
			href: 'https://www.instagram.com/jupjupar/', color: '#B4FF00', code: 'IG', tag: 'SOCIAL',
			icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
		},
		{
			id: 'email', label: 'Email', handle: 'zufarrasyid11@gmail.com',
			href: 'mailto:zufarrasyid11@gmail.com', color: '#B4FF00', code: 'ML', tag: 'DIRECT',
			icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>`,
		},
		{
			id: 'github', label: 'GitHub', handle: 'Vonhautten',
			href: 'https://github.com/Vonhautten', color: '#B4FF00', code: 'GH', tag: 'CODE',
			icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
		},
		{
			id: 'pinterest', label: 'Pinterest', handle: '@zufarrasyid',
			href: 'https://id.pinterest.com/zufarrasyidibrahim/', color: '#B4FF00', code: 'PT', tag: 'INSPIRE',
			icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>`,
		},
	] as Social[],
};

// ─── SITE META ───────────────────────────────────────────────
export const siteMeta = {
	title:       'Muhammad Zufar Rasyid Ibrahim — Portofolio',
	description: 'Full Stack Developer & Software Engineering Student based in Cimahi, Indonesia.',
	url:         'https://zufar.dev',
	ogImage:     '/og-image.png',
};