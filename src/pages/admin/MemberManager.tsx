import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMembers,
  createMember,
  updateMember,
  deleteMember,
} from "@/store/slices/memberSlice";

const MemberManager = () => {
  const dispatch = useAppDispatch();
  const { members, loading } = useAppSelector((state) => state.members);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingMember, setEditingMember] = useState<{ id: number; name: string; photo: string | null } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Nama member wajib diisi",
        variant: "destructive",
      });
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    if (imageFile) {
      payload.append("photo", imageFile);
    }

    try {
      if (editingMember) {
        await dispatch(updateMember({ id: editingMember.id, formData: payload })).unwrap();
        toast({ title: "Berhasil", description: "Member berhasil diupdate" });
      } else {
        if (!imageFile) {
          toast({
            title: "Error",
            description: "Foto member wajib diupload",
            variant: "destructive",
          });
          return;
        }
        await dispatch(createMember(payload)).unwrap();
        toast({ title: "Berhasil", description: "Member berhasil ditambahkan" });
      }
      resetForm();
      dispatch(fetchMembers());
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan member",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (member: { id: number; name: string; photo: string | null }) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
    });
    setImagePreview(member.photo);
    setImageFile(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus member ini?")) return;

    try {
      await dispatch(deleteMember(id)).unwrap();
      toast({ title: "Berhasil", description: "Member berhasil dihapus" });
      dispatch(fetchMembers());
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus member",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: "" });
    setImageFile(null);
    setImagePreview(null);
    setEditingMember(null);
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <div className="p-5 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Member Manager</h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Tambah Member</Button>
          )}
        </div>

        {isEditing && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingMember ? "Edit Member" : "Tambah Member Baru"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nama Member</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama Member"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Foto Member</label>
                <Input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  required={!editingMember}
                />
                {editingMember && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Kosongkan jika tidak ingin mengubah foto
                  </p>
                )}
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover border-2 border-border"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : editingMember ? (
                    "Update"
                  ) : (
                    "Simpan"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Member Grid */}
        {loading && !members.length ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : members.length === 0 ? (
          <Card className="p-12 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">Belum ada member yang terdaftar</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {members.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <div className="aspect-square bg-muted relative flex items-center justify-center">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-24 h-24 text-muted-foreground" />
                  )}
                </div>
                <div className="p-4">
                  <div className="font-semibold mb-3 text-center">{member.name}</div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(member)}
                      className="flex-1"
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(member.id)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MemberManager;
