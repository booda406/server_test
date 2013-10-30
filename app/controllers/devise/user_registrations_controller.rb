class Devise::UserRegistrationsController < Devise::RegistrationsController
	 skip_before_filter :verify_authenticity_token  
end