# WebDialog'� oluştur ve onun HTML dosyasını ayarla
face_dialog = UI::WebDialog.new
path = Sketchup.find_support_file "palet.html", "Plugins/Yukleme"
face_dialog.set_file path

# Adjust camera
view = Sketchup.active_model.active_view
eye = [910.33, 784.461, 370.248]
target = [144.768, 283.353, 60.108]
up = [-0.268593, -0.175811, 0.947073]
cam = Sketchup::Camera.new eye, target, up
view.camera = cam

# Upload vehicle model
ent = Sketchup.active_model.entities
dl = Sketchup.active_model.definitions
file_path = Sketchup.find_support_file "sin.skp", "Plugins/Yukleme"
comp_def = dl.load file_path
t = Geom::Transformation.translation [0, 0, 0]
inst = ent.add_instance comp_def, t

mats = Sketchup.active_model.materials

# Set the WebDialog's callback
face_dialog.add_action_callback("create_face") {|d, arg|
	if arg.to_s.length == 0
		puts "Invalid input. Coordinates must be valid numbers."
	else
		v = arg.to_s.split(",")
		pt1 = Geom::Point3d.new(0,0,0)
		pt2 = Geom::Point3d.new(0, Float(v[3].strip).cm,0)
		pt3 = Geom::Point3d.new(Float(v[4].strip).cm, Float(v[3].strip).cm,0)
		pt4 = Geom::Point3d.new(Float(v[4].strip).cm,0,0)
		face = Sketchup.active_model.entities.add_face pt1, pt2, pt3, pt4
		case v[6].strip
			when "A"
				new_mat = mats.add "or_mat"
				save_path = Sketchup.find_support_file "1.jpg", "Plugins/Yukleme"
			when "B"
				new_mat = mats.add "tofas_mat"
				save_path = Sketchup.find_support_file "2.jpg", "Plugins/Yukleme"
			when "C"
				new_mat = mats.add "tofas_mat"
				save_path = Sketchup.find_support_file "3.jpg", "Plugins/Yukleme"
			when "D"
				new_mat = mats.add "tofas_mat"
				save_path = Sketchup.find_support_file "4.jpg", "Plugins/Yukleme"
			when "E"
				new_mat = mats.add "tofas_mat"
				save_path = Sketchup.find_support_file "5.jpg", "Plugins/Yukleme"
			when "F"
				new_mat = mats.add "tofas_mat"
				save_path = Sketchup.find_support_file "6.jpg", "Plugins/Yukleme"
			when "G"
				new_mat = mats.add "tofas_mat"
				save_path = Sketchup.find_support_file "7.jpg", "Plugins/Yukleme"
			when "H"
				new_mat = mats.add "tofas_mat"
				save_path = Sketchup.find_support_file "8.jpg", "Plugins/Yukleme"
			when "I"
				new_mat = mats.add "tofas_mat"
				save_path = Sketchup.find_support_file "9.jpg", "Plugins/Yukleme"
			when "J"
				new_mat = mats.add "tofas_mat"
				save_path = Sketchup.find_support_file "10.jpg", "Plugins/Yukleme"
			when "K"
				new_mat = mats.add "tofas_mat"
				save_path = Sketchup.find_support_file "11.jpg", "Plugins/Yukleme"
			when "L"
				new_mat = mats.add "tofas_mat"
				save_path = Sketchup.find_support_file "12.jpg", "Plugins/Yukleme"
			when "M"
				new_mat = mats.add "tofas_mat"
				save_path = Sketchup.find_support_file "13.jpg", "Plugins/Yukleme"
			when "N"
				new_mat = mats.add "tofas_mat"
				save_path = Sketchup.find_support_file "14.jpg", "Plugins/Yukleme"
			when "O"
				new_mat = mats.add "tofas_mat"
				save_path = Sketchup.find_support_file "15.jpg", "Plugins/Yukleme"
			else
				new_mat = mats.add "tm_mat"
				save_path = Sketchup.find_support_file "16.jpg", "Plugins/Yukleme"
		end
		new_mat.texture = save_path
		face.material = new_mat
		face.reverse!
		face.pushpull Float(v[5].strip).cm
		group1 = ent.add_group face.all_connected
		t = Geom::Transformation.translation [Float(v[1].strip).cm, Float(v[0].strip).cm, Float(v[2].strip).cm+177.8.cm]
		group1.move! t
	end
}
# Display the dialog box
if RUBY_PLATFORM.index "darwin"
face_dialog.show_modal
else
face_dialog.show
end