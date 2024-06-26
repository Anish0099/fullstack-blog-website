"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
type UpdateBlogParams = {
  title: string;
  description: string;
  id: string;
};

const EditBlog = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    toast.loading("Fetching Blog Details 🚀", { id: "1" });
    getBlogById(params.id)
      .then((data) => {
        const {
          post: [blogPost],
        } = data;
        if (titleRef.current && descriptionRef.current) {
          titleRef.current.value = blogPost.title;
          console.log(data.title);
          descriptionRef.current.value = blogPost.description;
          toast.success("Fetching Complete", { id: "1" });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error fetching blog", { id: "1" });
      });
  }, []);

  const updateBlog = async (data: UpdateBlogParams) => {
    const res = fetch(`/api/blog/${data.id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: data.title,
        description: data.description,
      }),
      //@ts-ignore
      "Content-Type": "application/json",
    });
    return (await res).json();
  };

  const deleteBlog = async (id: string) => {
    const res = fetch(`/api/blog/${id}`, {
      method: "DELETE",
      //@ts-ignore
      "Content-Type": "application/json",
    });
    return (await res).json();
  };

  const getBlogById = async (id: string) => {
    const res = await fetch(`/api/blog/${id}`);
    const data = await res.json();
    console.log(data);
    return data;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (titleRef.current && descriptionRef.current) {
      toast.loading("Sending Request 🚀", { id: "1" });
      await updateBlog({
        title: titleRef.current?.value,
        description: descriptionRef.current?.value,
        id: params.id,
      });
      toast.success("Blog Posted Successfully", { id: "1" });
      await router.push("/");
    }
  };
  const handleDelete = async () => {
    toast.loading("Deleting Blog", { id: "2" });
    await deleteBlog(params.id);
    toast.success("Blog Deleted", { id: "2" });
    router.push("/");
  };
  return (
    <Fragment>
      <Toaster />
      <div className="w-full m-auto flex my-4 p-2">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className="text-2xl dark:text-slate-200 font-bold p-3">
            Edit A Wonderful Blog 🚀
          </p>
          <form onSubmit={handleSubmit}>
            <input
              ref={titleRef}
              placeholder="Enter Title"
              type="text"
              className="rounded-md  bg-slate-200 dark:bg-slate-800 px-4 w-full py-2 my-2 "
            />
            <textarea
              ref={descriptionRef}
              placeholder="Enter Description"
              className="bg-slate-200 dark:bg-slate-800  rounded-md px-4 py-2 w-full my-2"
            ></textarea>
            <div className="flex justify-center items-center">
              <Button className="font-semibold px-4 py-2 shadow-xl  rounded-lg m-auto ">
                Update
              </Button>
              <Button
                variant={"destructive"}
                onClick={handleDelete}
                className="font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg  m-auto mt-2 hover:bg-red-500"
              >
                Delete
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default EditBlog;
