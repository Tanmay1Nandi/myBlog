import { FileInput, Select, TextInput, Button } from 'flowbite-react'
import React from 'react'
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function CreatePost() {
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Create a Post</h1>
        <form className='flex flex-col gap-4'>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput type='text' placeholder='Title' is='title' required className='flex-1'/>
                <Select>
                    <option value="uncategorized">Select a category</option>
                    <option value="javascript">Javascript</option>
                    <option value="reactjs">React.js</option>
                    <option value="nextjs">Next.js</option>
                </Select>
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <FileInput type="file" accept='image/*' />
                <Button className='bg-gradient-to-r from-purple-500 to to-blue-500 py-5 text-gray-100 cursor-pointer sm:whitespace-nowrap' type="button" size='sm'>UPLOAD IMAGE</Button>
            </div>
            <ReactQuill theme='snow' placeholder='Write something...' className='h-72 mb-12 '/>
            <Button type='submit' className='bg-gradient-to-r from-purple-500 to-pink-500'>Publish</Button>
        </form>
    </div>
  )
}
