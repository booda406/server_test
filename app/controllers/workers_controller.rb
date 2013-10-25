class WorkersController < ApplicationController
  	before_action :authenticate_user!

  respond_to :json, :xml
  def show
  	@worker = Worker.find(params[:id])
  end
end
