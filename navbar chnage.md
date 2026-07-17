{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 Redesign the navigation bar to feel like a premium luxury architecture website (Apple, Foster + Partners, Studio McGee, Aesop).\
\
## Requirements\
\
### Desktop\
\
- Fixed navbar.\
- Height: 84px.\
- Width: 100%.\
- Content inside a centered container.\
- Max-width: 1500px.\
- Horizontal padding: 40px.\
\
Logo on the left.\
Navigation on the right.\
\
Everything perfectly vertically centered.\
\
---\
\
### Mobile\
\
Completely redesign the mobile navigation.\
\
Navbar:\
- Height: 72px.\
- Logo aligned left.\
- Hamburger aligned right.\
- Both perfectly centered vertically.\
\
The hamburger should have:\
- 3 thin white lines\
- 26px width\
- Smooth morph animation into an X.\
\
---\
\
### Scroll Behavior\
\
At page load:\
\
- Navbar background should be transparent.\
- No shadow.\
- No blur.\
\
After scrolling more than 40px:\
\
Animate to:\
\
background: rgba(15,15,15,0.72);\
backdrop-filter: blur(22px);\
border-bottom: 1px solid rgba(255,255,255,.08);\
\
Do NOT suddenly change colors.\
\
Animate over 300ms.\
\
---\
\
### Hide on Scroll\
\
Scrolling DOWN:\
- Navbar slides upward and disappears.\
\
Scrolling UP:\
- Navbar smoothly slides back.\
\
Never flicker.\
\
Ignore tiny scroll movements below 5px.\
\
---\
\
### Mobile Menu\
\
When opened:\
\
- Full-screen overlay.\
- Background:\
rgba(8,8,8,.97)\
\
Menu items centered vertically.\
\
Spacing between items:\
40px\
\
Typography:\
\
font-size: clamp(36px,7vw,64px)\
\
font-weight: 500\
\
letter-spacing: -.02em\
\
Menu animation:\
\
Overlay fades in.\
\
Each menu item slides upward while fading in with staggered animation.\
\
---\
\
### Hover Effects\
\
Desktop links:\
\
No default underline.\
\
Instead create a premium underline animation.\
\
On hover:\
\
text color:\
#D4B483\
\
Underline grows left to right.\
\
Duration:\
250ms.\
\
---\
\
### Logo\
\
Increase visual weight.\
\
Font:\
Bold.\
\
Letter spacing:\
-1px.\
\
Never stretch.\
\
Always aligned to navigation.\
\
---\
\
### Remove\
\
- Thick black header\
- Uneven spacing\
- Large empty padding\
- Jumpy transitions\
- Misaligned hamburger icon\
- Header flashing while scrolling\
\
---\
\
### Final Result\
\
The navigation should feel identical in quality to:\
\
\'95 Apple.com\
\'95 Foster + Partners\
\'95 Studio McGee\
\'95 Aesop\
\'95 Linear.app\
\
Everything should be buttery smooth (60fps), minimal, elegant, and luxurious without changing the existing brand colors or HTML structure.}