class UserDTO {
	name;
	email;
	phone;
	position_id;
	image_name;

	constructor(name, email, phone, position_id, image_name) {
		this.name = name,
		this.email = email,
		this.phone = phone,
		this.position_id = position_id
		this.image_name = image_name
	}
}

module.exports = UserDTO;