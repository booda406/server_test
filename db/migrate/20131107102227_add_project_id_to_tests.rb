class AddProjectIdToTests < ActiveRecord::Migration
  def change
  	add_column :tests, :project_id, :integer
  end
end
