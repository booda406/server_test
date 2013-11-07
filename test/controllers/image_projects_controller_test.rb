require 'test_helper'

class ImageProjectsControllerTest < ActionController::TestCase
  setup do
    @image_project = image_projects(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:image_projects)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create image_project" do
    assert_difference('ImageProject.count') do
      post :create, image_project: { framework: @image_project.framework, image_url: @image_project.image_url, name: @image_project.name }
    end

    assert_redirected_to image_project_path(assigns(:image_project))
  end

  test "should show image_project" do
    get :show, id: @image_project
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @image_project
    assert_response :success
  end

  test "should update image_project" do
    patch :update, id: @image_project, image_project: { framework: @image_project.framework, image_url: @image_project.image_url, name: @image_project.name }
    assert_redirected_to image_project_path(assigns(:image_project))
  end

  test "should destroy image_project" do
    assert_difference('ImageProject.count', -1) do
      delete :destroy, id: @image_project
    end

    assert_redirected_to image_projects_path
  end
end
