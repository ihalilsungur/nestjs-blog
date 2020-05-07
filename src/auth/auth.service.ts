import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDTO, LoginDTO } from 'src/models/user.dto';

@Injectable()
export class AuthService {
   
    private mockUser = {
        
            "user": {
              "email": "sungur@gmail.com",
              "token": "jwt.token.here",
              "username": "jake",
              "bio": "I work at statefarm",
              "image": null
            }
          }

          login(credentials : LoginDTO) {
            if(credentials.email === this.mockUser.user.email){
                return this.mockUser;
            }
            throw new InternalServerErrorException();
        }
      

          register(credentials:RegisterDTO) {
              credentials;
              console.log("Register :",credentials);
            return this.mockUser;
        }

        
    
}
