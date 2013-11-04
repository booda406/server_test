class PostsController < ApplicationController
  	before_action :authenticate_user!

	respond_to :html, :json, :xml

  	def index
  		@posts = Post.all
      #@posts = Post.find(:all, :conditions => {:user_id => current_user.id})
  	end

  	def show
  		@post = Post.find(params[:id])
  	end

  	def create
   	 @post = Post.new(post_create_params)
  
   		   	if @post.save
      			render json: @post, status: :ok
           	else
 			    render json: @post.errors, status: :unprocessable_entity
       		end
  	end

	def update
		@post = Post.find(params[:id])
		
		if @post.update_attributes(post_create_params)
			render json: @post, status: :ok
		else
			render json: @post.errors, status: :unprocessable_entity
		end
	end

	def destroy
    	@post = Post.find(params[:id])
    	@post.destroy
    	render json: nil, status: :ok
  	end

  private

  def post_create_params
      params.require(:post).permit(:title, :body, :user_id)
  end

end
