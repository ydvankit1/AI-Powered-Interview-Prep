import { Button } from "@/components/ui/button";
import Image from "next/image";
import Dashboard from "./dashboard/page";
import { redirect } from "next/navigation";

export default function Home() {
  // return (
  //   <div>
  //     <h2>ANKIT YADAV</h2>
  //     <Button>Subscribe</Button>
  //   </div>
  // );
  redirect("/dashboard"); 
}
