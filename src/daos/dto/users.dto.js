export default class usersDto {
  constructor(first_name, last_name, email, age, role) {
    this.username = first_name + " " + last_name
    this.email = email
    this.age = age
    this.role = role
  }
}
