"use client";
import { CareerGuuideResponse, uitls_servie } from "@/types/types";
import axios from "axios";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Lightbulb,
  Loader,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

function CareerGuide() {
  const [open, setOpen] = useState(false);
  const [skils, setSkils] = useState<string[]>([]);
  const [currentskill, setCurresntskill] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CareerGuuideResponse | null>(null);

  const addSkiil = () => {
    if (currentskill.trim() && !skils.includes(currentskill.trim())) {
      setSkils((prev) => [...prev, currentskill]);
      setCurresntskill("");
    }
  };
  const removeSkills = (skillToRemove: string) => {
    setSkils(skils.filter((item) => item != skillToRemove));
  };
  const hadnelPressKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addSkiil();
    }
  };
  const carreaGuidence = async () => {
    if (skils.length == 0) {
      alert("Please add atleast one skill");
      return;
    }
    setLoading(true);
    try {

      const response = await axios.post(`${uitls_servie}/api/utils/career`, {
        skills:skils,
      });
      const data = response.data;
      setResponse(data);
    } catch (e: any) {
        console.log(e)
      alert(e);
    } finally {
      setLoading(false);
    }
  };
  const resetDialog = () => {
    setSkils([]);
    setCurresntskill("");
    setResponse(null);
    setOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 ">
      <div className="text-center mb-12 ">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-blue-50 dark:bg-blue-950 mb-4">
          <Sparkles size={16} />
          <span className="text-sm font-medium">
            AI powered career guidence
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Discover your career path
        </h2>
        <p className="text-lg opacity-70 max-w-2xl mx-auto mb-8">
          Get personalized job recomendations and learnings roadmap based on
          your skill
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size={"lg"} className="gap-2">
              <Sparkles size={18} />
              Get Career guidence
              <ArrowRight size={18} />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl  max-h-[90vh] overflow-y-auto">
            {!response ? (
              <>
                <DialogHeader className="flex items-center text-2xl gap-2">
                  <Sparkles className="text-blue-600"></Sparkles>
                  Tell use about your skills
                  <DialogDescription>
                    Add your technial skills to recieve personalized career
                    recomendations
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2 ">
                    <Label htmlFor="skill">Add skills</Label>
                    <div className="flex gap-2">
                      <Input
                        id="skill"
                        placeholder="e.g React,Node.js,Java.."
                        value={currentskill}
                        onChange={(e) => setCurresntskill(e.target.value)}
                        className="h-11"
                        onKeyDown={hadnelPressKey}
                      ></Input>
                      <Button onClick={addSkiil} className="gap-2">
                        Add
                      </Button>
                    </div>
                  </div>
                  {skils.length > 0 && (
                    <div className="space-y-2">
                      <Label>Your skills ({skils.length})</Label>
                      <div className="flex flex-wrap gap-2">
                        {skils.map((s) => (
                          <div
                            key={s}
                            className="inline-flex items-center
                                        gap-2 pl-3 pr-2 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30
                                        border border-blue-200 dark:border-blue-800"
                          >
                            <span className="text-sm font-medium">{s}</span>
                            <Button
                              onClick={() => removeSkills(s)}
                              variant={"destructive"}
                              className="h-5 w-5 rounded-full bg-red-500 text-white
                                                flex in-checked:justify-center"
                            >
                              <X size={13} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button
                    onClick={carreaGuidence}
                    disabled={loading || skils.length == 0}
                    className="w-full h-11 gap-2 "
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={18}
                          className="
                        animate-spin "
                        >
                          Analyzing your skilss...
                        </Loader2>
                      </>
                    ) : (
                      <>
                        <Sparkles
                          size={18}
                          className="
                        animate-spin "
                        ></Sparkles>
                        Generate career guidence
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-2 ">
                    <Target className="text-blue-600 " />
                    Your personalized career guidence
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4 ">
                  {/**summary  */}
                  <div
                    className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30
                border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-start gap-3">
                      <Lightbulb
                        className="text-blue-600 mt-1 shrink-0"
                        size={20}
                      />
                    </div>
                    <h3 className="font-semibold mb-2">Career Summary</h3>
                    <p className="text-sm leading-relaxed opacity-90">
                      {response.summary}
                    </p>
                  </div>
                  {/*job options*/}
                  <div>
                    <h3
                      className="text-lg font-semibold mb-3 flex items-center 
                    gap-2"
                    >
                      <Briefcase size={20} className="text-blue-600" />
                      Recomonend career path
                    </h3>
                    <div className="space-y-3">
                      {response.jobOptions.map((job, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg 
                                hover:border-blue-500 transition-colors "
                        >
                          <h4 className="font-semibold text-base mb-2">
                            {job.title}
                          </h4>
                          <div className="spac-y-2 text-sm">
                            <div className="">
                              <span className="font-medium opacity-70">
                                Responsibilities
                              </span>
                              <span className="opacity-80">
                                {job.responsibilities}
                              </span>
                            </div>
                            <span className="font-medium opacity-70">
                              Why this role
                            </span>
                            <span className="opacity-80">{job.why}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/**skills to learn */}
                  <div>
                    <h3
                      className="text-lg font-semibold mb-3 items-center gap-2
                    "
                    >
                      <TrendingUp size={20} className="text-blue-600" />
                      Skills to enhance your career
                    </h3>
                    <div className="space-y-4">
                      {response.skillsToLearn.map((cat, index) => (
                        <div key={index} className="space-y-2">
                          <div
                          
                            className="font-semibold text-sm
                            text-blue-600"
                          >
                            <h4>{cat.category}</h4>
                            {
                                cat.skills.map((skills,index)=>(
                                    <div key={index} className="p-3 rounded-lg bg-secondary border
                                    text-sm ">
                                        <p className="font-medium mb-1 ">{skills.title}</p>
                                        <p className="text-xs opacity-70 mb-1">
                                            <span className="font-medium">Why:</span>{
                                                skills.why
                                            }
                                        </p>
                                         <p className="text-xs opacity-70 mb-1">
                                            <span className="font-medium">How:</span>{
                                                skills.how
                                            }
                                        </p>

                                    </div>
                                ))
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/**learning approach */}

                  <div className="p-4 rounded-lg border bg-blue-950/20 
                  dark:bg-red-950/20">
                    <h3 className="text-lg font-semibold mb-3 items-center gap-2">
                        <BookOpen size={20} className="text-blue-600"/>
                        {response.learningApproach.title}
                        

                    </h3>
                    <ul className="space-y-2">
                        {response.learningApproach.points.map((p,index)=>(
                            <li key={index} className="text-sm flex items-start gap-2">
                                <span className="text-blue-600">•</span>
                                <span  className='opacity-90' dangerouslySetInnerHTML={{__html:p}}></span>

                            </li>
                        ))}
                    </ul>
                  </div>
                  <Button onClick={resetDialog} variant={"outline"} className="w-full">
                    Start new Analysis

                  </Button>

                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default CareerGuide;
