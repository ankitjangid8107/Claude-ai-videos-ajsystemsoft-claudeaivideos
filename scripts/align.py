#!/usr/bin/env python3
"""
Voiceover -> src/data/sync.json (phrase + word level).
Method: (1) ffmpeg silencedetect gives the true speech intervals of public/voiceover.mp3,
(2) each transcript phrase is bound to its speech interval(s) (verified against faster-whisper
segment timestamps: scene starts 8.1s 'Mat kijiye', 22.8s brand, 43.7s offer, 72.5s dashboard, 111.7s 'AJ System Soft dot in'),
(3) words inside an interval are placed by a syllable-weighted aligner.
"""
import re, json, subprocess
AUDIO = "public/voiceover.mp3"; FPS = 30
SCENE_IDS = ["hook", "problem", "brand", "offer", "dashboard", "slots", "cta"]
# (scene, phrase text, [speech-interval indexes])
P = [
 (0,"Ek second rukiye...",[0]),
 (0,"Kya aap abhi bhi apne business ki website aur mobile app banwane ke liye",[1]),
 (0,"pachchis se pachhattar hazaar rupaye kharch karne ka soch rahe hain?",[2]),
 (0,"Mat kijiye.",[3]),
 (1,"Aaj ke market mein sirf offline shop ya purana system kaafi nahi hai.",[4]),
 (1,"Customers sabse pehle online search karte hain...",[5]),
 (1,"aur agar aapka khud ka digital brand nahi hai,",[6]),
 (1,"toh aapke clients seedha aapke competitors ke paas ja rahe hain.",[7]),
 (2,"Isi gap ko khatam karne aaya hai —",[8]),
 (2,"A_J System Soft Technology.",[9]),
 (2,"Ek M_S_M_E registered software company, jahan koi copy-paste template nahi chalta.",[10]),
 (2,"Hum banate hain custom websites,",[11]),
 (2,"Android aur iOS apps,",[12]),
 (2,"SaaS platforms",[13]),
 (2,"aur smart business dashboards —",[14]),
 (2,"jo sirf aapke business workflow ke hisaab se design hote hain.",[15]),
 (3,"Aur ab, is Christmas festival par,",[16]),
 (3,"hum aapke business ke liye laaye hain sabse bada Christmas gift —",[17]),
 (3,"ek aisa offer",[18]),
 (3,"jo aapne pehle kabhi nahi dekha hoga.",[19]),
 (3,"Poore 6 months ke liye, aapki fully customized website aur mobile application —",[20]),
 (3,"bilkul free.",[21]),
 (3,"Ji haan,",[22]),
 (3,"aapne bilkul sahi suna.",[23]),
 (3,"Sirf domain aapka rahega...",[24]),
 (3,"baaki poori development,",[25]),
 (3,"custom design,",[26]),
 (3,"setup aur tech support —",[27]),
 (3,"sab kuch hamari taraf se.",[28]),
 (3,"Koi hidden charges nahi,",[29]),
 (3,"koi forced template nahi.",[30]),
 (4,"Chahe aapka retail store ho,",[31]),
 (4,"clinic ya hospital ho,",[32]),
 (4,"hotel ho,",[33]),
 (4,"manufacturing unit ho",[34]),
 (4,"ya coaching institute —",[35]),
 (4,"aapko milega fast-loading design,",[36]),
 (4,"smart admin panel,",[37]),
 (4,"S_E_O setup aur live billing,",[38]),
 (4,"inventory aur sales tracking.",[39]),
 (4,"Modern cloud tech ki speed ke saath,",[40]),
 (4,"aapka business chalega bilkul autopilot par.",[41]),
 (5,"Yaad rakhiye,",[42]),
 (5,"hum har client ke project par personal focus dete hain,",[43]),
 (5,"isliye is Christmas special free offer ke slots",[44]),
 (5,"bohot limited hain.",[45]),
 (5,"Ye mauka dobara nahi aayega.",[46]),
 (6,"Toh der kis baat ki?",[47]),
 (6,"Is Christmas apne business ko dijiye ek smart digital upgrade.",[48]),
 (6,"Abhi visit kijiye",[49]),
 (6,"A_J System Soft dot in par,",[50]),
 (6,"ya screen par diye gaye WhatsApp button par message kijiye —",[51]),
 (6,"aur claim kijiye apna free offer,",[52]),
 (6,"aaj hi.",[53]),
]
def syl(w):
    if "_" in w: return len(w.split("_")) * 1.0
    w = re.sub(r"[^a-z0-9]", "", w.lower())
    if w.isdigit(): return 2.0
    n = max(1, len(re.findall(r"[aeiouy]+", w)))
    if w.endswith("e") and n > 1 and not w.endswith(("ye", "ke", "ee")): n -= 1
    return float(n)

dur = float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","default=nw=1:nk=1",AUDIO]).decode())
out = subprocess.run(["ffmpeg","-v","info","-i",AUDIO,"-af","silencedetect=noise=-33dB:d=0.18","-f","null","-"],capture_output=True,text=True).stderr
st=[float(x) for x in re.findall(r"silence_start: ([\d.]+)",out)]; en=[float(x) for x in re.findall(r"silence_end: ([\d.]+)",out)]
iv=[];prev=0.0
for a,b in zip(st,en):
    if a>prev+0.05: iv.append((prev,a))
    prev=b
iv.append((prev,dur))
assert len(iv)==54, f"expected 54 speech intervals, got {len(iv)}"

words=[]; phrase_first=[]
for sc,text,ivs in P:
    toks=re.findall(r"\.\.\.|[—,.?]|[^\s—,.?]+",text)
    ws=[];pun=[]
    for t in toks:
        if t in ("...","—",",",".","?"):
            if ws: pun[-1]=t
        else: ws.append(t); pun.append("")
    a=iv[ivs[0]][0]; b=iv[ivs[-1]][1]
    # slight breathing trim so highlights feel natural
    weights=[syl(w) for w in ws]; tot=sum(weights); c=a
    first=len(words)
    for w,wt,p in zip(ws,weights,pun):
        d=(b-a)*wt/tot
        words.append(dict(w=w.replace("_",""),spoken=w,scene=sc,start=round(c,3),end=round(c+d,3),punct=p))
        c+=d
    phrase_first.append((first,len(words)-1))

# scenes (continuous; boundary 0.12s before the first word of the next scene)
firsts=[next(i for i,w in enumerate(words) if w["scene"]==s) for s in range(7)]
scenes=[]
for s,sid in enumerate(SCENE_IDS):
    # hook->problem hands over 0.5s after the first word of scene 2 so the Rs.0 reveal gets screen time
    off=lambda k: words[firsts[k]]["start"]+(0.5 if k==1 else -0.12)
    a=0.0 if s==0 else off(s)
    b=dur if s==6 else off(s+1)
    scenes.append(dict(id=sid,start=round(a,3),end=round(b,3),startFrame=round(a*FPS),endFrame=round(b*FPS)))

# captions: per phrase, split into <=5-word beats
captions=[]
for (f,l) in phrase_first:
    n=l-f+1; k=max(1,-(-n//5)); size=-(-n//k)
    for i in range(f,l+1,size):
        j=min(l,i+size-1)
        captions.append(dict(start=words[i]["start"],end=words[j]["end"],first=i,last=j))
data=dict(fps=FPS,duration=round(dur,3),durationInFrames=int(round(dur*FPS)),scenes=scenes,words=words,captions=captions)
json.dump(data,open("src/data/sync.json","w"),ensure_ascii=False,indent=1)
print("duration",dur,"frames",data["durationInFrames"],"words",len(words),"captions",len(captions))
for s in scenes: print(f'{s["id"]:10s} {s["start"]:7.2f} {s["end"]:7.2f}  ({s["end"]-s["start"]:.1f}s)')
