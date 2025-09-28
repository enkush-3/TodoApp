import {Button} from "@/components/ui/button.jsx";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Label} from "@/components/ui/label.jsx";
import {useState} from "react";
import {EditIcon} from "lucide-react";

export default function EditTodo({title, id, handleUpdate}) {
    const [updatedTitle, setUpdatedTitle] = useState(title);
    const [open, setOpen] = useState(false); // ✅ dialog нээх/хаах state

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <EditIcon className="w-5 h-5 cursor-pointer text-blue-500 hover:text-blue-600 transition-colors duration-200" />
            </DialogTrigger>

            <DialogContent className="sm:max-w-[450px] rounded-2xl shadow-xl border border-gray-200 bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-blue-600">
                        ✏️ Edit Todo
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate({ title: updatedTitle, id });
                        setOpen(false);
                    }}
                    className="flex flex-col gap-4"
                >
                    <input type="hidden" value={id} name="id" />
                    <Label htmlFor="title" className="text-gray-600 font-medium">
                        Previous Todo
                    </Label>
                    <Input
                        id="title"
                        name="title"
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                        className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />

                    <DialogFooter>
                        <Button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 shadow-md"
                        >
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
